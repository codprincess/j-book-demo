/**
 * 1、判断用户是否登录
 * 2、文章文件上传腾讯云
 */

import {getDB} from "~/server/utils/db/mysql";
import { getLoginUid, responseJson} from "~/server/utils/helper";
import COS from 'cos-nodejs-sdk-v5'
import STS from 'qcloud-cos-sts'
import Joi from "joi";

const conf = useRuntimeConfig()
// 配置参数
var config = {
    secretId: conf.SecretId, // 固定密钥
    secretKey: conf.SecretKey, // 固定密钥
    proxy: '',
    durationSeconds: 1800,
    // host: 'sts.tencentcloudapi.com', // 域名，非必须，默认为 sts.tencentcloudapi.com
    endpoint: 'sts.tencentcloudapi.com', // 域名，非必须，与host二选一，默认为 sts.tencentcloudapi.com

    // 放行判断相关参数
    bucket: conf.public.BUCKET,
    region: conf.public.REGION,
    allowPrefix: '', // 这里改成允许的路径前缀，可以根据自己网站的用户登录态判断允许上传的具体路径，例子： a.jpg 或者 a/* 或者 * (使用通配符*存在重大安全风险, 请谨慎评估使用)
    // 简单上传和分片，需要以下的权限，其他权限列表请看 https://cloud.tencent.com/document/product/436/31923
    allowActions: [
        // 简单上传
        'name/cos:PutObject',
        'name/cos:PostObject',
        // 分片上传
        'name/cos:InitiateMultipartUpload',
        'name/cos:ListMultipartUploads',
        'name/cos:ListParts',
        'name/cos:UploadPart',
        'name/cos:CompleteMultipartUpload'
    ],
};

export default defineEventHandler(async (event)=>{
    //判断用户登录
    let uid = getLoginUid(event)
    console.log('uid',uid)
    if (uid === 0) {
        // @ts-ignore
        setResponseStatus(event,401)
        return responseJson(1,'请先登录',{})
    }
    //获取数据
    const params = await getQuery(event)
    console.log('params',params)

    //校验数据joi
    const schema = Joi.object({
        type: Joi.string().required()
    });
    try {
        const value = await schema.validateAsync(params);
    }
    catch (err) {
        return  responseJson(1,'参数错误',{})
    }

    if (params.type !== "avatar" && params.type !== "note") {
        return  responseJson(1,'参数错误~',{})
    }

    config.allowPrefix = "uploads/"+ uid + "/" + params.type + "/*"
    // 获取临时密钥
    var shortBucketName = config.bucket.substr(0 , config.bucket.lastIndexOf('-'));
    var appId = config.bucket.substr(1 + config.bucket.lastIndexOf('-'));
    var policy = {
        'version': '2.0',
        'statement': [{
            'action': config.allowActions,
            'effect': 'allow',
            'principal': {'qcs': ['*']},
            'resource': [
                'qcs::cos:' + config.region + ':uid/' + appId + ':prefix//' + appId + '/' + shortBucketName + '/' + config.allowPrefix,
            ],
            // condition生效条件，关于 condition 的详细设置规则和COS支持的condition类型可以参考https://cloud.tencent.com/document/product/436/71306
            // 'condition': {
            //   // 比如限定ip访问
            //   'ip_equal': {
            //     'qcs:ip': '10.121.2.10/24'
            //   }
            // }
        }],
    };
   const result = await STS.getCredential({
        secretId: config.secretId,
        secretKey: config.secretKey,
        proxy: config.proxy,
        durationSeconds: config.durationSeconds,
        endpoint: config.endpoint,
        policy: policy,
    });

   return responseJson(0,'ok~~~',result)

})
