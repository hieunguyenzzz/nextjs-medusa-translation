import {Collection, MongoClient} from "mongodb";

const mongoDbUrl = process.env.DATABASE_URL || "mongodb://mongo:129e2271d42a113768d0@easypanel.hieunguyen.dev:27017";
const dbName = 'my-database';

interface Translate {
    text: string,
    translation: string,
    targetLanguage: string
}

export default async function getMongoDBAdapter() {
    const client = new MongoClient(mongoDbUrl);
    await client.connect();
    const db = client.db(dbName);
    return db.collection('translation');
}