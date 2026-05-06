import { ImageResponse } from '@vercel/og';
import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

// Se usan las variables de entorno inyectadas por Vercel. 
// Vercel inyectará process.env aunque estemos en un proyecto Vite para las Edge Functions.
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export default async function ogHandler(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    const renderGenericImage = () => {
      return new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f8fafc',
              fontFamily: 'Inter, sans-serif',
              padding: '40px',
              borderBottom: '16px solid #7c3aed',
            }}
          >
            <h1 style={{ fontSize: 80, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Builders
            </h1>
            <p style={{ fontSize: 32, color: '#475569', marginTop: 20 }}>
              La plataforma para builders hispanohablantes
            </p>
          </div>
        ),
        { width: 1200, height: 630 }
      );
    };

    if (!slug) {
      return renderGenericImage();
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: builder, error } = await supabase
      .from('builders')
      .select('name, bio, avatar_url, projects(id)')
      .eq('slug', slug)
      .single();

    if (error || !builder) {
      return renderGenericImage();
    }

    const projectCount = builder.projects?.length || 0;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
            fontFamily: 'Inter, sans-serif',
            padding: '40px',
            borderBottom: '16px solid #7c3aed',
          }}
        >
          {builder.avatar_url ? (
            <img
              src={builder.avatar_url}
              alt="Avatar"
              style={{
                width: 180,
                height: 180,
                borderRadius: '50%',
                marginBottom: 30,
                objectFit: 'cover',
                border: '4px solid #fff',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              }}
            />
          ) : (
            <div
              style={{
                width: 180,
                height: 180,
                borderRadius: '50%',
                marginBottom: 30,
                backgroundColor: '#e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 70,
                fontWeight: 600,
                color: '#64748b',
                border: '4px solid #fff',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              }}
            >
              {builder.name.charAt(0).toUpperCase()}
            </div>
          )}
          <h1 style={{ fontSize: 60, fontWeight: 800, color: '#0f172a', margin: '0 0 20px 0', textAlign: 'center' }}>
            {builder.name}
          </h1>
          {builder.bio && (
            <p style={{ fontSize: 30, color: '#475569', margin: '0 0 40px 0', textAlign: 'center', maxWidth: '800px', lineHeight: 1.4 }}>
              {builder.bio.length > 120 ? builder.bio.substring(0, 117) + '...' : builder.bio}
            </p>
          )}
          <div
            style={{
              backgroundColor: 'rgba(124,58,237,0.1)',
              padding: '12px 32px',
              borderRadius: '999px',
              fontSize: 26,
              color: '#7c3aed',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              border: '2px solid rgba(124,58,237,0.2)'
            }}
          >
            {projectCount} {projectCount === 1 ? 'proyecto' : 'proyectos'} en Builders
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error(e);
    return new Response(`Failed to generate the image`, { status: 500 });
  }
}
