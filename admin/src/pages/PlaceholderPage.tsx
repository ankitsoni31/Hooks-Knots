interface PlaceholderPageProps {
    title: string;
}

function PlaceholderPage({ title }: PlaceholderPageProps) {
    return (
        <div>
            <h1 style={{ margin: 0, color: '#111827' }}>{title}</h1>
            <p style={{ marginTop: '16px', color: '#6b7280' }}>{title} module coming in Phase 4.</p>
        </div>
    );
}

export default PlaceholderPage;
