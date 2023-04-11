import express from 'express';
import routes from './routes';
import { serverInitialization } from './utils/serverInitialization';
import { watchForChanges } from './utils/watcher';

const app = express();
const port = process.env.PORT || 3000;

app.use('/', routes());

// Watch for changes in posts dir
watchForChanges();

// Initialize the server
(async () => {
    await serverInitialization();
    
    app.listen(port, () => {
        console.log(`Scribbler server is running on port ${port}`);
    });
})();
