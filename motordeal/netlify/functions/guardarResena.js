import { createClient } from '@supabase/supabase-js';
import sgMail from '@sendgrid/mail';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { nombre, email, mensaje } = req.body;

        // Guardar en Supabase
        const { data, error } = await supabase
            .from('Reseñas')
            .insert([{ nombre, email, mensaje }]);

        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al guardar en Supabase' });
        }

        // Enviar correo
        const msg = {
            to: process.env.NOTIFY_EMAIL,
            from: process.env.SENDER_EMAIL,
            subject: `Nueva reseña de ${nombre}`,
            text: `
                Nombre: ${nombre}
                Email: ${email}
                Mensaje: ${mensaje || 'Sin mensaje'}
            `,
        };

        await sgMail.send(msg);

        res.status(200).json({ message: 'Reseña enviada correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};