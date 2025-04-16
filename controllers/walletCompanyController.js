const Company = require("../models/companyModel");

exports.getCompanyById = async (req, res) => {
  const { companyId } = req.params;

  if (!companyId) {
    return res.status(400).send({ message: "Company ID is required" });
  }

  try {
    const company = await Company.findByPk(companyId);

    if (!company) {
      return res.status(404).send({ message: "Company not found" });
    }

    return res.status(200).send(company);
  } catch (error) {
    return res.status(500).send({ message: "Server error", error });
  }
};

exports.getWalletBalance = async (req, res) => {
  const { companyId } = req.params;

  if (!companyId) {
    return res.status(400).send({ message: "Company ID is required" });
  }

  try {
    const company = await Company.findByPk(companyId);

    if (!company) {
      return res.status(404).send({ message: "Company not found" });
    }

    return res.status(200).send({ balance: company.walletBalance });
  } catch (error) {
    return res.status(500).send({ message: "Server error", error });
  }
};

exports.getTransactionById = async (req, res) => {
  const { transactionId } = req.params;

  if (!transactionId) {
    return res.status(400).send({ message: "Transaction ID is required" });
  }

  try {
    const transaction = await Transaction.findByPk(transactionId);

    if (!transaction) {
      return res.status(404).send({ message: "Transaction not found" });
    }

    return res.status(200).send(transaction);
  } catch (error) {
    return res.status(500).send({ message: "Server error", error });
  }
};
