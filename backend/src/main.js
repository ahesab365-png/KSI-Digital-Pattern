import bootstrap from "./app.bootstrap.js";
import { port } from '../config/config.service.js';

const app = await bootstrap();

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(port, () => console.log(`Server is running on port ${port}!`));
}

export default app;