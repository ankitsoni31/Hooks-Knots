function LoadingScreen() {
    return (
        <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px' }}>
            <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '1rem', color: '#333' }}>Loading admin panel...</p>
            </div>
        </div>
    );
}

export { LoadingScreen };
