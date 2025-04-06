const { validationResult } = require('express-validator');
const QRCode = require('qrcode');
const HttpError = require('../models/http-error');
const { sendVerificationEmail } = require("../util/email");
//const crypto = require('crypto'); // To generate random verification codes

const User = require('../models/user');

const qrcodeGenerator = async (req, res, next) => {
    const { id , oib } = req.params;
    let user;
    try {
        user = await User.findById(id);
    } catch (err) {
        const error = new HttpError(
        'Something went wrong, could not find a user.',
        500
        );
        return next(error);
    }

    if (!user) {
        const error = new HttpError(
        'Could not find user for the provided id.',
        404
        );
        return next(error);
    }
    
    // Podaci za uplatu
    const IBAN = "HR9624070001100239255"; // IBAN primatelja
    const iznos = "70.00"; // Iznos uplate
    const valuta = "EUR"; // Valuta
    const model = "HR00"; // Model poziva na broj
    const pozivNaBroj = oib; // OIB korisnika
    const opisPlacanja = `${user.name} ${user.surname}`; // Ime i prezime korisnika
    const primatelj = "VATERPOLO KLUB GARMENJAK"; // Ime primatelja
    const adresaPrimatelja = "OBALA TAMARISA 6"; // Adresa primatelja
    const postanskiBrojMesto = "PAŠMAN"; // Poštanski broj i mesto primatelja

    // Formatiranje podataka u HUB 3 QR kod format
    const qrData = `HRVHUB30\n${valuta}\n${iznos}\n${primatelj}\n${IBAN}\n${opisPlacanja}\n${model}\n${pozivNaBroj}\n${adresaPrimatelja}\n${postanskiBrojMesto}`;
    const paymentData =`HRVHUB30
                        EUR
                        500.00
                        Pera Perić
                        Ulica 123
                        10000 Zagreb
                        Firma d.o.o.
                        Adresa firme 456
                        21000 Split
                        HR1234567890123456789
                        HR99 1234-567890
                        Plaćanje računa #12345`;
    //console.log(qrData)
    try {
        const qrCodeUrl = await QRCode.toDataURL(paymentData);  // Generisanje QR koda
        res.json({ success: true, qrCodeUrl });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }};
  
  exports.qrcodeGenerator = qrcodeGenerator;
 