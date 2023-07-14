// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import getMongoDBAdapter from "@/adapter/translation";

type Data = {
  name: string
}

type locale = "es" | "fr";

type Translation = {
  _id: string,
  text:string,
  targetLanguages: string,
  translation: string
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Translation[]>
) {
  const { locale, limit, search } = req.query; // Get the "locale" parameter from the URL query string
  const translationAdapter = await getMongoDBAdapter();

  let spanish
  if (limit && !search) {
    spanish = await translationAdapter.find<Translation>({targetLanguage: locale}).limit(20).toArray();
  } else {
    if (search) {
      const regex = new RegExp(search, "i");
      spanish = await translationAdapter.find<Translation>({targetLanguage: locale, text: regex}).toArray();
    } else {
      spanish = await translationAdapter.find<Translation>({targetLanguage: locale}).toArray();
    }

  }

  res.status(200).json(spanish)
}
