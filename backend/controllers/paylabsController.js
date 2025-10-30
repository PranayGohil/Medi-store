import axios from 'axios';
import crypto from 'crypto';
import rs from 'node-jsrsasign';
import { convertUSDtoIDR } from '../utils/currencyConverter.js';

// Paylabs API Helper Class
class PaylabsAPI {
    constructor(config) {
        this.baseUrl = config.baseUrl || 'https://sit-pay.paylabs.co.id';
        this.version = config.version || 'v2.1';
        this.merchantId = config.merchantId;
        this.privateKey = config.privateKey;
    }

    generateTimestamp() {
        const now = new Date();
        now.setHours(now.getHours() + 7); // GMT+7
        now.setSeconds(now.getSeconds() - 5);

        const milliseconds = now.toISOString().split('.')[1].slice(0, 3);
        const timestamp = now.toISOString().split('.')[0] + '.' + milliseconds + '+07:00';

        return timestamp;
    }

    generateRequestId() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

        return `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
    }

    generateSignature(method, path, requestBody, timestamp) {
        try {
            const privateKey = this.privateKey.includes('BEGIN RSA PRIVATE KEY') ?
                this.privateKey :
                `-----BEGIN RSA PRIVATE KEY-----\n${this.privateKey}\n-----END RSA PRIVATE KEY-----`;

            const requestBodyOneLine = JSON.stringify(requestBody);
            const shaJson = crypto.createHash('sha256')
                .update(requestBodyOneLine)
                .digest('hex')
                .toLowerCase();

            const signatureBefore = `${method}:${path}:${shaJson}:${timestamp}`;

            try {
                const sig = new rs.KJUR.crypto.Signature({ "alg": "SHA256withRSA" });
                sig.init(privateKey);
                sig.updateString(signatureBefore);
                const signature = rs.hextob64(sig.sign());
                return signature;
            } catch (signError) {
                const signer = crypto.createSign('SHA256');
                signer.update(signatureBefore);
                const signature = signer.sign(privateKey, 'base64');
                return signature;
            }
        } catch (error) {
            console.error('❌ Signature generation error:', error);
            throw new Error(`Signature generation failed: ${error.message}`);
        }
    }

    generateHeaders(timestamp, signature, requestId) {
        return {
            'X-TIMESTAMP': timestamp,
            'X-SIGNATURE': signature,
            'X-PARTNER-ID': this.merchantId,
            'X-REQUEST-ID': requestId,
            'Content-Type': 'application/json;charset=utf-8'
        };
    }

    async createPayment(paymentData) {
        try {
            console.log('🔄 Starting Paylabs payment creation...');

            const path = `/payment/${this.version}/cc/create`;
            const url = `${this.baseUrl}${path}`;
            console.log('Paylabs Create Payment URL:', url);

            const timestamp = this.generateTimestamp();
            const requestId = this.generateRequestId();

            const requestBody = {
                merchantId: this.merchantId,
                merchantTradeNo: paymentData.merchantTradeNo,
                requestId: requestId,
                paymentType: 'CreditCard',
                amount: paymentData.amount,
                productName: paymentData.productName,
                paymentParams: {
                    redirectUrl: paymentData.redirectUrl
                }
            };
            console.log('Paylabs Create Payment Request Body:', requestBody);
            const signature = this.generateSignature('POST', path, requestBody, timestamp);
            const headers = this.generateHeaders(timestamp, signature, requestId);

            const response = await axios.post(url, requestBody, {
                headers,
                timeout: 30000,
                validateStatus: null
            });
            console.log('Paylabs Create Payment Response:', response.data);
            if (response.status >= 400) {
                throw new Error(`HTTP ${response.status}: ${JSON.stringify(response.data)}`);
            }

            const result = {
                success: true,
                requestId: response.data.requestId,
                merchantTradeNo: response.data.merchantTradeNo,
                platformTradeNo: response.data.platformTradeNo,
                status: response.data.status,
                amount: response.data.amount,
                payUrl: response.data.paymentActions?.payUrl,
                createTime: response.data.createTime,
                expiredTime: response.data.expiredTime
            };

            console.log('✅ Paylabs payment created successfully', result);
            return result;
        } catch (error) {
            console.error('❌ Paylabs payment creation error:', error);
            throw error;
        }
    }

    async queryPayment(merchantTradeNo) {
        const path = `/payment/${this.version}/cc/query`;
        const url = `${this.baseUrl}${path}`;

        const timestamp = this.generateTimestamp();
        const requestId = this.generateRequestId();

        const requestBody = {
            merchantId: this.merchantId,
            merchantTradeNo: merchantTradeNo,
            requestId: requestId,
            paymentType: 'CreditCard'
        };

        const signature = this.generateSignature('POST', path, requestBody, timestamp);
        const headers = this.generateHeaders(timestamp, signature, requestId);

        try {
            const response = await axios.post(url, requestBody, { headers });
            return response.data;
        } catch (error) {
            console.error('Payment query error:', error.response?.data || error.message);
            throw error;
        }
    }
}

// Initialize Paylabs API
const paylabsConfig = {
    baseUrl: process.env.PAYLABS_BASE_URL || 'https://sit-pay.paylabs.co.id',
    version: process.env.PAYLABS_VERSION || 'v2.1',
    merchantId: process.env.PAYLABS_MERCHANT_ID,
    privateKey: process.env.PAYLABS_PRIVATE_KEY
};

const paylabs = new PaylabsAPI(paylabsConfig);

// Create Paylabs Payment
export const createPaylabsPayment = async (req, res) => {
    try {
        const { amount, productName, redirectUrl } = req.body;
        console.log('💥 Paylabs payment creation request body:', req.body);

        if (!amount || !productName || !redirectUrl) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: amount, productName, redirectUrl'
            });
        }

        const merchantTradeNo = `TXN${Date.now()}`;

        let amountInIDR = await convertUSDtoIDR(amount, true);

        const paymentData = {
            merchantTradeNo,
            amount: amountInIDR.toString(),
            productName,
            redirectUrl
        };

        const result = await paylabs.createPayment(paymentData);
        console.log('💥 Paylabs payment creation result:', result);
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('💥 Paylabs payment creation failed:', error);

        res.status(error.response?.status || 500).json({
            success: false,
            error: error.response?.data || error.message
        });
    }
};

// Query Paylabs Payment Status
export const queryPaylabsPayment = async (req, res) => {
    try {
        if (!req.body || !req.body.merchantTradeNo) {
            return res.status(400).json({
                success: false,
                error: 'Missing required field: merchantTradeNo'
            });
        }

        const { merchantTradeNo } = req.body;
        const result = await paylabs.queryPayment(merchantTradeNo);
        console.log('✅ Paylabs payment query result:', result);
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('❌ Query payment error:', error);

        const statusCode = error.response?.status || 500;

        res.status(statusCode).json({
            success: false,
            error: error.response?.data || error.message
        });
    }
};

// Paylabs Payment Callback/Webhook
export const paylabsCallback = async (req, res) => {
    try {
        let callbackData = (req.body && Object.keys(req.body).length) ? req.body : null;

        if (!callbackData && req.rawBody) {
            const ct = (req.headers['content-type'] || '').toLowerCase();
            if (ct.includes('application/json') || ct.includes('text/plain')) {
                try {
                    callbackData = JSON.parse(req.rawBody);
                } catch (e) {
                    // not JSON
                }
            }

            if (!callbackData && ct.includes('application/x-www-form-urlencoded')) {
                const qs = require('querystring');
                callbackData = qs.parse(req.rawBody);
            }

            if (!callbackData) {
                try { callbackData = JSON.parse(req.rawBody); } catch (e) { /* ignore */ }
            }
        }

        if (!callbackData) {
            console.warn('Callback received with empty body');
            return res.status(400).json({ success: false, error: 'Empty callback payload' });
        }

        const merchantTradeNo = callbackData.merchantTradeNo ||
            callbackData.merchant_trade_no ||
            callbackData.trxId ||
            callbackData.orderId;

        if (!merchantTradeNo) {
            console.warn('Callback payload missing merchantTradeNo:', callbackData);
            return res.status(400).json({
                success: false,
                error: "Missing merchantTradeNo in callback payload",
                received: callbackData
            });
        }

        console.log('Paylabs callback processed for:', merchantTradeNo, 'payload:', callbackData);

        // You can add Order update logic here similar to PayPal
        // Example: Update order status based on callback data

        res.json({ success: true, message: 'Callback processed successfully' });
    } catch (error) {
        console.error('Error processing Paylabs callback:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export { PaylabsAPI };