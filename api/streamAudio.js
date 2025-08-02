export default async function handler(req, res) {
    try {
        const { trackId, download } = req.query;
        
        if (!trackId) {
            return res.status(400).json({ error: 'trackId manquant' });
        }

        // Permettre les requêtes depuis votre app
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

        // Récupérer les infos du track depuis Base44
        const response = await fetch(`https://base44.app/api/apps/${process.env.BASE44_APP_ID}/entities/Track/${trackId}`);
        
        if (!response.ok) {
            return res.status(404).json({ error: 'Track non trouvé' });
        }

        const track = await response.json();
        
        if (!track.audio_url) {
            return res.status(404).json({ error: 'Audio non disponible' });
        }

        // Récupérer l'audio depuis Suno
        const audioResponse = await fetch(track.audio_url);
        
        if (!audioResponse.ok) {
            return res.status(500).json({ error: 'Audio inaccessible' });
        }

        // Configurer les headers pour le streaming
        res.setHeader('Content-Type', 'audio/mpeg');
        
        if (download === 'true') {
            const filename = track.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            res.setHeader('Content-Disposition', `attachment; filename="${filename}.mp3"`);
        }

        // Envoyer l'audio
        const audioBuffer = await audioResponse.arrayBuffer();
        res.send(Buffer.from(audioBuffer));

    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: error.message });
    }
}
