const Subscription = require('../models/Subscription');
const ResponseHandler = require('../utils/responseHandler');

exports.getSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find({ userId: req.userId }).sort({ renewalDate: 1 });
    return ResponseHandler.success(res, subscriptions);
  } catch (error) {
    next(error);
  }
};

exports.createSubscription = async (req, res, next) => {
  try {
    const { name, amount, category, renewalDate } = req.body;

    const subscription = await Subscription.create({
      userId: req.userId,
      name,
      amount,
      category,
      renewalDate
    });

    return ResponseHandler.created(res, subscription, 'Subscription created successfully');
  } catch (error) {
    next(error);
  }
};

exports.deleteSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!subscription) {
      return ResponseHandler.error(res, 'Subscription not found', 404);
    }

    return ResponseHandler.success(res, null, 'Subscription deleted successfully');
  } catch (error) {
    next(error);
  }
};
