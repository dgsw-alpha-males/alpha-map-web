import axios from "axios";
import ArticleModel from "@src/article.model";
import BaseModel from "@src/base.model";
import {tagAlt} from "./tagPaths";

const fetchArticle = async (tag: string): Promise<BaseModel<ArticleModel> | undefined> => {
    try {
        const {data} = await axios.get(`http://3.38.61.26:80/article/${tag}`);
        console.log(data);
        return data;
    } catch (e) {
        console.error(e);
    }
};

const fetchArticles = async (): Promise<BaseModel<[ArticleModel]> | undefined> => {
    try {
        const {data} = await axios.get(`http://3.38.61.26:80/article/all`);
        data.data.forEach((article: ArticleModel) => {
            article.alt = tagAlt[article.tag];
        });
        console.log(data);
        return data;
    } catch (e) {
        console.error(e);
    }
}

const fetchAI = async (prompt: string): Promise<BaseModel<string> | undefined> => {
    try {
        const {data} = await axios.post(`http://3.38.61.26:80/ai/chat`, {
            message: prompt
        });
        console.log(data);
        return data;
    } catch (e) {
        console.error(e);
    }
}

// const

export {
    fetchArticle,
    fetchAI,
    fetchArticles
};