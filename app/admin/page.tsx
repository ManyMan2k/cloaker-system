import Link from 'next/link';
import { campaignManager } from '@/lib/campaigns';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [campaigns, globalStats] = await Promise.all([
    campaignManager.listCampaigns(),
    logger.getStats(24),
  ]);

  return (
    <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'sans-serif', color: '#fff' }}>
      
      {/* === HEADER === */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '40px',
        paddingBottom: '20px',
        borderBottom: '1px solid #333'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '32px', background: 'linear-gradient(90deg, #fff, #999)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            🎯 Cloaker Dashboard
          </h1>
          <p style={{ color: '#888', margin: '5px 0 0 0', fontSize: '14px' }}>
            Visão geral das últimas 24 horas
          </p>
        </div>
        <Link 
          href="/admin/campaigns/new"
          style={{
            padding: '12px 24px',
            background: '#0070f3',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)'
          }}
        >
          + Nova Campanha
        </Link>
      </div>

      {/* === ESTATÍSTICAS GLOBAIS === */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '20px',
        marginBottom: '50px'
      }}>
        <StatCard 
          title="Total Requests" 
          value={globalStats.total}
          icon="📊"
          color="#3b82f6"
          bg="rgba(59, 130, 246, 0.1)"
        />
        <StatCard 
          title="Blocked (Robôs)" 
          value={globalStats.blocked}
          subtitle={`${globalStats.blockRate}%`}
          icon="🛡️"
          color="#ef4444"
          bg="rgba(239, 68, 68, 0.1)"
        />
        <StatCard 
          title="Allowed (Humanos)" 
          value={globalStats.total - globalStats.blocked}
          subtitle={`${(100 - parseFloat(globalStats.blockRate || '0')).toFixed(2)}%`}
          icon="✅"
          color="#22c55e"
          bg="rgba(34, 197, 94, 0.1)"
        />
        <StatCard 
          title="Conversions" 
          value={globalStats.converted}
          subtitle={`${globalStats.conversionRate}%`}
          icon="💰"
          color="#eab308"
          bg="rgba(234, 179, 8, 0.1)"
        />
      </div>

      {/* === LISTA DE CAMPANHAS === */}
      <div>
        <h2 style={{ marginBottom: '25px', fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          🚀 Minhas Campanhas
        </h2>
        
        <div style={{ display: 'grid', gap: '20px' }}>
          {campaigns.map(campaign => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}

          {campaigns.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '80px', 
              background: '#111',
              borderRadius: '16px',
              border: '1px dashed #333'
            }}>
              <p style={{ color: '#666', fontSize: '18px', marginBottom: '20px' }}>
                📭 Nenhuma campanha criada ainda
              </p>
              <Link 
                href="/admin/campaigns/new"
                style={{ 
                  color: '#0070f3',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '16px'
                }}
              >
                Criar primeira campanha →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, color, bg }: any) {
  return (
    <div style={{ 
      padding: '24px', 
      background: '#111',
      borderRadius: '16px',
      border: '1px solid #222',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ 
        position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', 
        background: bg, filter: 'blur(40px)', borderRadius: '50%' 
      }} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
        <div>
          <p style={{ margin: 0, fontSize: '14px', color: '#888', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {title}
          </p>
          <p style={{ margin: '10px 0 0 0', fontSize: '36px', fontWeight: 'bold', color: '#fff' }}>
            {value.toLocaleString()}
          </p>
          {subtitle && (
            <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: color, fontWeight: '600' }}>
              {subtitle}
            </p>
          )}
        </div>
        <div style={{ 
          background: '#1a1a1a', 
          width: '50px', height: '50px', 
          borderRadius: '12px', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '24px',
          border: '1px solid #333'
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function CampaignCard({ campaign }: any) {
  const blockRate = campaign.views > 0 
    ? ((campaign.blocked / campaign.views) * 100).toFixed(1) 
    : '0';
  
  const conversionRate = (campaign.views - campaign.blocked) > 0
    ? ((campaign.conversions / (campaign.views - campaign.blocked)) * 100).toFixed(1)
    : '0';

  return (
    <div style={{ 
      padding: '25px', 
      border: '1px solid #222', 
      borderRadius: '16px',
      background: '#111',
      transition: 'transform 0.2s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '22px', color: '#fff' }}>{campaign.name}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#666', fontSize: '14px', background: '#222', padding: '4px 8px', borderRadius: '6px' }}>
              /c/{campaign.slug}
            </span>
          </div>
        </div>
        <div style={{ 
          padding: '6px 12px', 
          borderRadius: '20px',
          background: campaign.isActive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: campaign.isActive ? '#22c55e' : '#ef4444',
          fontSize: '12px',
          fontWeight: '700',
          border: campaign.isActive ? '1px solid #14532d' : '1px solid #7f1d1d'
        }}>
          {campaign.isActive ? 'ATI V A' : 'PAUSADA'}
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '20px',
        marginBottom: '25px',
        padding: '20px',
        background: '#161616',
        borderRadius: '12px',
        border: '1px solid #222'
      }}>
        <StatMini label="Views" value={campaign.views} color="#fff" />
        <StatMini label="Blocked" value={campaign.blocked} sub={`${blockRate}%`} color="#ef4444" />
        <StatMini label="Passed" value={campaign.views - campaign.blocked} color="#22c55e" />
        <StatMini label="Conversions" value={campaign.conversions} sub={`${conversionRate}%`} color="#eab308" />
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <Link 
          href={`/admin/campaigns/${campaign.id}`}
          style={{ 
            flex: 1,
            textAlign: 'center',
            padding: '12px', 
            background: '#0070f3', 
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          ✏️ Editar Configurações
        </Link>
        <Link 
          href={`/c/${campaign.slug}`}
          target="_blank"
          style={{ 
            padding: '12px 24px', 
            background: '#222', 
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            border: '1px solid #333'
          }}
        >
          🔗 Testar Link
        </Link>
      </div>
    </div>
  );
}

function StatMini({ label, value, sub, color }: any) {
  return (
    <div>
      <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px', textTransform: 'uppercase', fontWeight: '600' }}>{label}</div>
      <div style={{ fontSize: '24px', fontWeight: 'bold', color: color }}>
        {value.toLocaleString()}
      </div>
      {sub && <div style={{ fontSize: '12px', color: '#555', marginTop: '2px' }}>{sub}</div>}
    </div>
  )
}