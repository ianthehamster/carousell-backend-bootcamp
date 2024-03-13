const BaseController = require('./baseController');

class ListingsController extends BaseController {
  constructor(model, userModel) {
    super(model);
    this.userModel = userModel;
  }

  /** if a method in this extended class AND the base class has the same name, the one in the extended class will run over the base method */
  // Create listing. Requires authentication.
  async insertOne(req, res) {
    const { title, category, condition, price, description, shippingDetails } =
      req.body;
    try {
      // TODO: Get seller email from auth, query Users table for seller ID DONE
      const [seller] = await this.userModel.findOrCreate({
        where: {
          email: req.body.sellerEmail,
        },
      });

      // Create new listing
      const newListing = await this.model.create({
        title: title,
        category: category,
        condition: condition,
        price: price,
        description: description,
        shippingDetails: shippingDetails,
        buyerId: null,
        sellerId: seller.id, // TODO: Replace with seller ID of authenticated seller DONE
      });

      // Respond with new listing
      return res.json(newListing);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: true, msg: err });
    }
  }

  // Retrieve specific listing. No authentication required.
  async getOne(req, res) {
    const { listingId } = req.params;
    try {
      const output = await this.model.findByPk(listingId);
      return res.json(output);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  // Buy specific listing. Requires authentication.
  async buyItem(req, res) {
    const { listingId } = req.params;
    try {
      const data = await this.model.findByPk(listingId);

      // TODO: Get buyer email from auth, query Users table for buyer ID

      // Retrieve seller from DB via seller email from auth
      const [buyer] = await this.userModel.findOrCreate({
        where: {
          email: req.body.buyerEmail,
        },
      });

      console.log(data, data.buyerId);

      console.log(buyer.dataValues.id, typeof buyer.dataValues.id);

      // Update listing to reference buyer's user id
      await data.update({ buyerId: buyer.dataValues.id }); // TODO: Replace with buyer ID of authenticated buyer

      // Respond to acknowledge update
      return res.json(data);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }
}

module.exports = ListingsController;
