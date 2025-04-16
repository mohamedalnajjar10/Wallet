const Company = require("../models/companyModel");
const ApiError = require("../utils/ApiError"); 

exports.showCompany = async (req, res) => {
  const companyId = req.params.id;

  if (!companyId) {
    return res.status(400).send({ message: "Company ID is required" });
  }

  await Company.findByPk(companyId)
    .then((company) => {
      if (!company) {
        return res.status(404).send({ message: "Company not found" });
      }
      res.status(200).send(company);
    })
    .catch((error) => {
      res.status(500).send({ message: "Server error", error });
    });
};

exports.getAllCompanies = async (req, res) => {
  await Company.findAll()
    .then((companies) => {
      if (!companies) {
        return res.status(404).send({ message: "No companies found" });
      }
      res.status(200).send({ result: companies.length, data: companies });
    })
    .catch((error) => {
      res.status(500).send({ message: "Server error", error });
    });
};

exports.updateCompany = async (req, res) => {
  const companyId = req.params.id;
  const { name, mobile, email, address, city } = req.body;

  if (!companyId) {
    return res.status(400).send({ message: "Company ID is required" });
  }

  try {
    const company = await Company.findByPk(companyId);

    if (!company) {
      return res.status(404).send({ message: "Company not found" });
    }

    await company.update({ name, mobile, email, address, city });

    res
      .status(200)
      .send({ message: "Company updated successfully", data: company });
  } catch (error) {
    res.status(500).send({ message: "Server error", error });
  }
};

exports.deleteCompany = async (req, res, next) => {
  const { id } = req.params;
  try {
    const company = await Company.findByPk(id);
    if (!company) {
      return next(new ApiError(`No Document For This Id ${id}`, 404));
    }
    await company.destroy();
    res.status(204).send({});
  } catch (error) {
    next(error); 
  }
};
