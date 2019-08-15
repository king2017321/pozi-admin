import request from '@/plugin/axios'
export const getToken=()=>{
    return request({
        url:'/wx/cgi-bin/token?grant_type=client_credential&appid=wx77b72750d6dd14e5&secret=f3139fb838c3bb76ed05758b5e2e294e'
    })
}
export const getUser=(data)=>{
    return request({
        url:`/wx/tcb/invokecloudfunction?access_token=${data}&env=fayuandi-v1&name=user`,
        method:'POST',
        data:{}
    })
}
export const addUser=(data)=>{
    return request({
        url:`/wx/tcb/invokecloudfunction?access_token=${data.token}&env=fayuandi-v1&name=addUser`,
        method:'POST',
        data
    })
}
export const updateUser=(data)=>{
    return request({
        url:`/wx/tcb/invokecloudfunction?access_token=${data.token}&env=fayuandi-v1&name=updateUser`,
        method:'POST',
        data
    })
}
export const chargeUser=(data)=>{
    return request({
        url:`/wx/tcb/invokecloudfunction?access_token=${data.token}&env=fayuandi-v1&name=charge`,
        method:'POST',
        data
    })
}
export const getCharge=(data)=>{
    return request({
        url:`/wx/tcb/invokecloudfunction?access_token=${data.token}&env=fayuandi-v1&name=getCharge`,
        method:'POST',
        data:{userId:data.userId}
    })
}
export const getTrade=(data)=>{
    return request({
        url:`/wx/tcb/invokecloudfunction?access_token=${data.token}&env=fayuandi-v1&name=trade`,
        method:'POST',
        data:{userId:data.userId}
    })
}
export const getProductList=(data)=>{
    return request({
        url:`/wx/tcb/invokecloudfunction?access_token=${data}&env=fayuandi-v1&name=productList`,
        method:'POST',
        data:{}
    })
}
export const getProduct=(data)=>{
    return request({
        url:`/wx/tcb/invokecloudfunction?access_token=${data}&env=fayuandi-v1&name=product`,
        method:'POST',
        data:{}
    })
}
export const addTrade=(data)=>{
    return request({
        url:`/wx/tcb/invokecloudfunction?access_token=${data.token}&env=fayuandi-v1&name=addTrade`,
        method:'POST',
        data
    })
}