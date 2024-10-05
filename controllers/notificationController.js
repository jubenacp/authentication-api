exports.sendNotification = (req, res) => {
    const { message, userId } = req.body;

    // Lógica para enviar notificación aquí

    res.status(200).json({ msg: 'Notification sent' });
};
