import { redirect } from 'next/navigation';
import { campaignManager } from '@/lib/campaigns';

export default function NewCampaign() {
  async function createCampaign(formData: FormData) {
    'use server';

    const slug = formData.get('slug') as string;
    
    await campaignManager.createCampaign({
      name: formData.get('name') as string,
      slug: slug,
      whitePageUrl: formData.get('whitePageUrl') as string,
      blackPageUrl: formData.get('blackPageUrl') as string,
      whitePageType: formData.get('whitePageType') as 'url' | 'html',
      blackPageType: formData.get('blackPageType') as 'url' | 'html',
      threshold: parseInt(formData.get('threshold') as string),
      checkUserAgent: formData.get('checkUserAgent') === 'on',
      checkIP: formData.get('checkIP') === 'on',
      checkFingerprint: formData.get('checkFingerprint') === 'on',
      checkReferer: formData.get('checkReferer') === 'on',
    });

    redirect('/admin');
  }

  // Estilo padrão para todos os inputs para garantir leitura
  const inputStyle = {
    width: '100%', 
    padding: '10px', 
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    color: '#000',           // FORÇA LETRA PRETA
    backgroundColor: '#fff'  // FORÇA FUNDO BRANCO
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', color: '#fff' }}>
      <h1>➕ Nova Campanha</h1>

      <form action={createCampaign} style={{ marginTop: '30px' }}>
        {/* === NOME === */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Nome da Campanha
          </label>
          <input 
            type="text" 
            name="name"
            placeholder="Ex: TikTok Emagrecimento"
            required
            style={inputStyle}
          />
        </div>

        {/* === SLUG === */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Slug (URL)
          </label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '5px', color: '#999' }}>/c/</span>
            <input 
              type="text" 
              name="slug"
              placeholder="tiktok-emagrecimento"
              required
              pattern="[a-z0-9-]+"
              style={{ ...inputStyle, flex: 1 }}
            />
          </div>
          <small style={{ color: '#999' }}>Apenas letras minúsculas, números e hífens</small>
        </div>

        {/* === WHITE PAGE (AMARELO) === */}
        <div style={{ 
          marginBottom: '20px', 
          padding: '20px', 
          background: '#fffbeb', // Fundo Claro
          border: '2px solid #fbbf24',
          borderRadius: '8px',
          color: '#000' // FORÇA LETRA PRETA DENTRO DO BOX
        }}>
          <h3 style={{ marginTop: 0, color: '#000' }}>🛡️ White Page (Página Segura)</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tipo</label>
            <select name="whitePageType" style={inputStyle}>
              <option value="url">URL / Path</option>
              <option value="html">HTML Customizado</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>URL</label>
            <input 
              type="text" 
              name="whitePageUrl"
              placeholder="https://example.com/artigo"
              required
              style={inputStyle}
            />
            <small style={{ color: '#555' }}>
              URL externa ou path interno
            </small>
          </div>
        </div>

        {/* === BLACK PAGE (VERDE) === */}
        <div style={{ 
          marginBottom: '20px', 
          padding: '20px', 
          background: '#ecfdf5', // Fundo Claro
          border: '2px solid #10b981',
          borderRadius: '8px',
          color: '#000' // FORÇA LETRA PRETA DENTRO DO BOX
        }}>
          <h3 style={{ marginTop: 0, color: '#000' }}>💰 Black Page (Oferta Real)</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tipo</label>
            <select name="blackPageType" style={inputStyle}>
              <option value="url">URL / Path</option>
              <option value="html">HTML Customizado</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>URL</label>
            <input 
              type="text" 
              name="blackPageUrl"
              placeholder="https://offer.com/landing"
              required
              style={inputStyle}
            />
          </div>
        </div>

        {/* === CONFIGURAÇÕES (CINZA) === */}
        <div style={{ 
          marginBottom: '20px', 
          padding: '20px', 
          background: '#1a1a1a', // Fundo Escuro para combinar com o tema
          border: '1px solid #333',
          borderRadius: '8px'
        }}>
          <h3 style={{ marginTop: 0, color: '#fff' }}>⚙️ Configurações</h3>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Threshold (Score para bloquear)
            </label>
            <input 
              type="number" 
              name="threshold"
              defaultValue="40"
              min="0"
              max="100"
              style={{ ...inputStyle, width: '100px' }}
            />
            <small style={{ color: '#999', marginLeft: '10px' }}>(0-100)</small>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', color: '#fff' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input type="checkbox" name="checkUserAgent" defaultChecked style={{ marginRight: '8px', width: '20px', height: '20px' }} />
              Verificar User-Agent
            </label>

            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input type="checkbox" name="checkIP" defaultChecked style={{ marginRight: '8px', width: '20px', height: '20px' }} />
              Verificar IP
            </label>

            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input type="checkbox" name="checkFingerprint" defaultChecked style={{ marginRight: '8px', width: '20px', height: '20px' }} />
              Verificar Fingerprint
            </label>

            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input type="checkbox" name="checkReferer" defaultChecked style={{ marginRight: '8px', width: '20px', height: '20px' }} />
              Verificar Referer
            </label>
          </div>
        </div>

        {/* === BOTÕES === */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="submit"
            style={{
              padding: '12px 24px',
              background: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            ✅ Criar Campanha
          </button>

          <a 
            href="/admin"
            style={{
              padding: '12px 24px',
              background: '#fff',
              color: '#333',
              border: 'none',
              borderRadius: '5px',
              textDecoration: 'none',
              display: 'inline-block',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}