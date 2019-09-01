import request from '@/plugin/axios'
let basurl=process.env.NODE_ENV=="development"?'/wx':"https://api.weixin.qq.com"
export const getStylist=(data)=>{
    return request({
        url:`${basurl}/tcb/invokecloudfunction?access_token=${data}&env=fayuandi-v1&name=stylist`,
        method:'POST',
        data:{}
    })
}
export const addStylist=(data)=>{
    return request({
        url:`${basurl}/tcb/invokecloudfunction?access_token=${data.token}&env=fayuandi-v1&name=addStylist`,
        method:'POST',
        data
    })
}
export const updateStylist=(data)=>{
    return request({
        url:`${basurl}/tcb/invokecloudfunction?access_token=${data.token}&env=fayuandi-v1&name=updateStylist`,
        method:'POST',
        data
    })
}
export const deleteStylist=(data)=>{
    return request({
        url:`${basurl}/tcb/invokecloudfunction?access_token=${data.token}&env=fayuandi-v1&name=deleteStylist`,
        method:'POST',
        data
    })
}
export const getUploadPath=(data)=>{
    return request({
        url:`${basurl}/tcb/uploadfile?access_token=${data.token}`,
        method:'POST',
        data:{
            env:'fayuandi-v1',
            path:data.path
        }
    })
}
export const getImgUrl=(data)=>{
    return request({
        url:`${basurl}/tcb/invokecloudfunction?access_token=${data.token}&env=fayuandi-v1&name=getImgUrl`,
        method:'POST',
        data:{
            fileList:data.fileList
        }
    })
}