import axios from "axios";
import { makeAuthData } from "./makeAuthData";

// mrx : cookie
import Cookies from 'js-cookie'

// links
import { POSTS, BASE_URL, HEADER_BASE } from './index';

// Get [get data]

export const GetUrl = async function (url, data, header) {

    const base = (!header) ? HEADER_BASE : header;
    const options = {
        method: 'GET',
        headers: {
            base,
        },
        data,
        url
    };

    const response = await axios(options)
    const str = JSON.stringify(response);
    const responseData = JSON.parse(str);
    return responseData;
    // return response;
};


// Get [get auth data]

export const GetAuthUrl = async function (url, data, header) {

    const base = (!header) ? HEADER_BASE : header;
    const options = {
        method: 'GET',
        headers: {
            base,
            ...makeAuthData(),
        },
        data,
        url
    };

    const response = await axios(options)
    const str = JSON.stringify(response);
    const responseData = JSON.parse(str);
    return responseData;
    // return response;
};

// Post [new data]

export const PostUrl = async (url, data, header) => {

    const base = (!header) ? HEADER_BASE : header;

    const options = {
        method: 'POST',
        headers: {
            base,
            // authorization: `Bearer ${JSON.parse(cookie)}`,
        },
        data,
        url,
    };

    try {
        const response = await axios(options)
        return response;
    } catch (error) {
        console.log(error)
    }

};


// Post [new auth data]

export const PostAuthUrl = async (url, data, header) => {

    const base = (!header) ? HEADER_BASE : header;

    const options = {
        method: 'POST',
        headers: {
            base,
            ...makeAuthData(),
            // authorization: `Bearer ${JSON.parse(cookie)}`,
        },
        data,
        url,
    };

    try {
        const response = await axios(options)
        return response;
    } catch (error) {
        console.log(error)
    }

};

// Put [update]

export const PutUrl = async (url, data, header) => {

    const base = (!header) ? HEADER_BASE : header;

    const options = {
        method: 'PUT',
        headers: {
            base,
            // authorization: `Bearer ${JSON.parse(cookie)}`,
        },
        data,
        url,
    };

    try {
        const response = await axios(options)
        return response;
    } catch (error) {
        console.log(error)
    }

};


// Put [new auth data]

export const PutAuthUrl = async (url, data, header) => {

    const base = (!header) ? HEADER_BASE : header;

    const options = {
        method: 'PUT',
        headers: {
            base,
            ...makeAuthData(),
            // authorization: `Bearer ${JSON.parse(cookie)}`,
        },
        data,
        url,
    };

    try {
        const response = await axios(options)
        return response;
    } catch (error) {
        console.log(error)
    }

};


// DELETE [update]

export const DeleteUrl = async (url, data, header) => {

    const base = (!header) ? HEADER_BASE : header;

    const options = {
        method: 'DELETE',
        headers: {
            base,
            // authorization: `Bearer ${JSON.parse(cookie)}`,
        },
        data,
        url,
    };

    try {
        const response = await axios(options)
        return response;
    } catch (error) {
        console.log(error)
    }

};


// DELETE [new auth data]

export const DeleteAuthUrl = async (url, data, header) => {

    const base = (!header) ? HEADER_BASE : header;

    const options = {
        method: 'DELETE',
        headers: {
            base,
            ...makeAuthData(),
            // authorization: `Bearer ${JSON.parse(cookie)}`,
        },
        data,
        url,
    };

    try {
        const response = await axios(options)
        return response;
    } catch (error) {
        console.log(error)
    }

};