import express from "express";
import QRCode from "qrcode";

const router = express.Router();

router.get("/qrcode/:name/:surname/:oib", async (req, res) => {
    const { name, surname, oib } = req.params;

    // Podaci za uplatu
    const IBAN = "HR9624070001100239255"; // IBAN primatelja
    const iznos = "70.00"; // Iznos uplate
    const valuta = "EUR"; // Valuta
    const model = "HR00"; // Model poziva na broj
    const pozivNaBroj = oib; // OIB korisnika
    const opisPlacanja = `${name} ${surname}`; // Ime i prezime korisnika
    const primatelj = "VATERPOLO KLUB GARMENJAK"; // Ime primatelja
    const adresaPrimatelja = "OBALA TAMARISA 6"; // Adresa primatelja
    const postanskiBrojMesto = "PAŠMAN"; // Poštanski broj i mesto primatelja

    // Formatiranje podataka u HUB 3 QR kod format
    const qrData = `HRVHUB30\n${valuta}\n${iznos}\n${primatelj}\n${IBAN}\n${opisPlacanja}\n${model}\n${pozivNaBroj}\n${adresaPrimatelja}\n${postanskiBrojMesto}`;

    try {
        const qrCodeUrl = await QRCode.toDataURL(qrData);  // Generisanje QR koda
        res.json({ success: true, qrCodeUrl });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
