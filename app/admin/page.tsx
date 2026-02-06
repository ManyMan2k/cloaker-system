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
    <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '40px' 
      }}>
        <div>
          <h1 style={{ margin: 0 }}>🎯 Cloaker Dashboard</h1>
          <p style={{ color: '#666', margin: '5px 0 0 0' }}>
            Últimas 24 horas
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
            fontWeight: '500',
            display: 'inline-block'
          }}
        >
          + Nova Campanha
        </Link>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '20px',
        marginBottom: '40px'
      }}>
        <StatCard 
          title="Total Requests" 
          value={globalStats.total}
          icon="📊"
          color="#0070f3"
        />
        <StatCard 
          title="Blocked" 
          value={globalStats.blocked}
          subtitle={`${globalStats.blockRate}%`}
          icon="🛡️"
          color="#f44"
        />
        <StatCard 
          title="Allowed" 
          value={globalStats.total - globalStats.blocked}
          subtitle={`${(100 - parseFloat(globalStats.blockRate)).toFixed(2)}%`}
          icon="✅"
          color="#4f4"
        />
        <StatCard 
          title="Conversions" 
          value={globalStats.converted}
          subtitle={`${globalStats.conversionRate}%`}
          icon="💰"
          color="#fb3"
        />
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2 style={{ marginBottom: '20px' }}>🎯 Campanhas</h2>
        
        <div style={{ display: 'grid', gap: '20px' }}>
          {campaigns.map(campaign => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}

          {campaigns.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px', 
              background: '#f9fafb',
              borderRadius: '12px',
              border: '2px dashed #ddd'
            }}>
              <p style={{ color: '#999', fontSize: '18px', marginBottom: '15px' }}>
                📭 Nenhuma campanha criada ainda
              </p>
              <Link 
                href="/admin/campaigns/new"
                style={{ 
                  color: '#0070f3',
                  textDecoration: 'none',
                  fontWeight: '500'
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

function StatCard({ title, value, subtitle, icon, color }: any) {
  return (
    <div style={{ 
      padding: '24px', 
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ 
            margin: 0, 
            fontSize: '14px', 
            color: '#6b7280',
            fontWeight: '500'
          }}>
            {title}
          </p>
          <p style={{ 
            margin: '8px 0 0 0', 
            fontSize: '32px', 
            fontWeight: 'bold',
            color: color
          }}>
            {value.toLocaleString()}
          </p>
          {subtitle && (
            <p style={{ 
              margin: '4px 0 0 0', 
              fontSize: '14px', 
              color: '#9ca3af'
            }}>
              {subtitle}
            </p>
          )}
        </div>
        <span style={{ fontSize: '32px' }}>{icon}</span>
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
      padding: '24px', 
      border: '1px solid #e5e7eb', 
      borderRadius: '12px',
      background: campaign.isActive ? 'white' : '#f9fafb',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '20px' }}>{campaign.name}</h3>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
            /c/{campaign.slug}
          </p>
        </div>
        <div style={{ 
          padding: '4px 12px', 
          borderRadius: '12px',
          background: campaign.isActive ? '#dcfce7' : '#fee2e2',
          color: campaign.isActive ? '#166534' : '#991b1b',
          fontSize: '12px',
          fontWeight: '600',
          height: 'fit-content'
        }}>
          {campaign.isActive ? '🟢 Ativa' : '🔴 Inativa'}
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '16px',
        marginBottom: '16px',
        paddingTop: '16px',
        borderTop: '1px solid #e5e7eb'
      }}>
        <div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Views</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {campaign.views.toLocaleString()}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Blocked</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>
            {campaign.blocked.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: '#9ca3af' }}>{blockRate}%</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Passed</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e' }}>
            {(campaign.views - campaign.blocked).toLocaleString()}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Conversions</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0070f3' }}>
            {campaign.conversions.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: '#9ca3af' }}>{conversionRate}%</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <Link 
          href={`/admin/campaigns/${campaign.id}`}
          style={{ 
            padding: '10px 20px', 
            background: '#0070f3', 
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            display: 'inline-block'
          }}
        >
          ✏️ Editar
        </Link>
        <Link 
          href={`/c/${campaign.slug}`}
          target="_blank"
          style={{ 
            padding: '10px 20px', 
            background: '#f3f4f6', 
            color: '#374151',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            display: 'inline-block'
          }}
        >
          🔗 Abrir
        </Link>
      </div>
    </div>
  );
}