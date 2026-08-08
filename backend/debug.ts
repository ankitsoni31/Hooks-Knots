async function start() {
    try {
        await import('./src/server.ts');
    } catch (e) {
        console.log("CAUGHT EXCEPTION!");
        console.error(e);
        if (e && e.errors) {
            console.error(JSON.stringify(e.errors, null, 2));
        }
    }
}
start();
