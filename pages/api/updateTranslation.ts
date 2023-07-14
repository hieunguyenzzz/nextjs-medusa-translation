// Next.js API route: /api/updateTranslation
import { NextApiRequest, NextApiResponse } from 'next';
import getMongoDBAdapter from "@/adapter/translation";
import {ObjectId} from "mongodb";

type UpdateTranslationData = {
    id: string;
    text: string;
    translation: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const translationAdapter = await getMongoDBAdapter();
    if (req.method === 'PUT') {
        const { id, text, translation } = req.body as UpdateTranslationData;
        console.log('Request data:', { id, text, translation });
        const filter = { _id: new ObjectId(id) }; // Use the id field as the filter condition
        const update = { $set: { translation } };
        const options = { returnOriginal: false };

        let data = await translationAdapter.updateOne(filter, update);

        console.log(data);
        // Add your logic to update the translation in your database here

        // Return a response
        res.status(200).json({ message: 'Translation updated successfully' });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
