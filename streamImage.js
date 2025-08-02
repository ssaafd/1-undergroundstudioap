Fichier 2: api/streamImage.js

export default async function handler(req, res) {
    try {
        const { trackId } = req.query;
        
        if (!trackId) {
            return res.status(400).json({ error: 'trackId manquant' });
        }

        res.setHeader('Access-Control-Allow-Origin', '*');

        // Récupérer les infos du track
        const response = await fetch(`https://base44.app/api/apps/${process.env.BASE44_APP_ID}/entities/Track/${trackId}`);
        
        if (!response.ok || !response) {
            return res.redirect('https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200&h=200&fit=crop');
        }

        const track = await response.json();
        
        if (track.cover_image_url) {
            return res.redirect(track.cover_image_url);
        } else {
            return res.redirect('https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200&h=200&fit=crop');
        }

    } catch (error) {
        return res.redirect('https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200&h=200&fit=crop');
    }
}
