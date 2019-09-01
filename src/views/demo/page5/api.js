import request from '@/plugin/axios'
let basurl=process.env.NODE_ENV=="development"?'/wx':"https://api.weixin.qq.com"
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
export const uploadImage=(data)=>{
    return request({
        url:`${basurl}/tcb/invokecloudfunction?access_token=${data.token}&env=fayuandi-v1&name=uploadIndexImage`,
        method:'POST',
        data:{
            image:data.image
        }
    })
}
export const getImage=(data)=>{
    return request({
        url:`${basurl}/tcb/invokecloudfunction?access_token=${data.token}&env=fayuandi-v1&name=getIndexImage`,
        method:'POST',
        data:{
            
        }
    })
}
export const getDescribe=(data)=>{
    return request({
        url:`${basurl}/tcb/invokecloudfunction?access_token=${data.token}&env=fayuandi-v1&name=getIndexDescribe`,
        method:'POST',
        data:{
            
        }
    })    
}
export const updateIndexDescribe=(data)=>{
    return request({
        url:`${basurl}/tcb/invokecloudfunction?access_token=${data.token}&env=fayuandi-v1&name=updateIndexDescribe`,
        method:'POST',
        data:{
            describe:data.describe
        }
    })    
}