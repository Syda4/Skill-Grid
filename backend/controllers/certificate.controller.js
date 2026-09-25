const Certificate = require("../models/certificate");

const getMyCertificates = async (req, res) => {

    try {

        const certificates = await Certificate.find({

            candidate: req.user.id

        })

        .populate("assessment", "title")

        .sort({ createdAt: -1 });

        res.json({

            success: true,

            certificates

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

const verifyCertificate = async (req, res) => {

    try {

        const certificate = await Certificate.findOne({

            certificateCode: req.params.code

        })

        .populate("candidate", "name email")

        .populate("assessment", "title")

        .populate("result");

        if (!certificate) {

            return res.status(404).json({

                success: false,

                message: "Certificate not found"

            });

        }

        res.json({

            success: true,

            certificate

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

module.exports = {

    getMyCertificates,

    verifyCertificate

};