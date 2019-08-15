import request from '@/plugin/axios'
export const getToken=()=>{
    return request({
        url:'/wx/cgi-bin/token?grant_type=client_credential&appid=wx77b72750d6dd14e5&secret=f3139fb838c3bb76ed05758b5e2e294e'
    })
}
export const getProductList=(data)=>{
    return request({
        url:`/wx/tcb/invokecloudfunction?access_token=${data}&env=fayuandi-v1&name=productList`,
        method:'POST',
        data:{}
    })
}
export const addProductList=(data)=>{
    return request({
        url:`/wx/tcb/invokecloudfunction?access_token=${data.token}&env=fayuandi-v1&name=addProductList`,
        method:'POST',
        data
    })
}
export const updateProductList=(data)=>{
    return request({
        url:`/wx/tcb/invokecloudfunction?access_token=${data.token}&env=fayuandi-v1&name=updateProduct`,
        method:'POST',
        data
    })
}
export const getProduct=(data)=>{
    return request({
        url:`/wx/tcb/invokecloudfunction?access_token=${data}&env=fayuandi-v1&name=product`,
        method:'POST',
        data:{}
    })
}
export const addProduct=(data)=>{
    return request({
        url:`/wx/tcb/invokecloudfunction?access_token=${data.token}&env=fayuandi-v1&name=addProduct`,
        method:'POST',
        data
    })
}
export const updateProduct=(data)=>{
    return request({
        url:`/wx/tcb/invokecloudfunction?access_token=${data.token}&env=fayuandi-v1&name=updateProduct`,
        method:'POST',
        data
    })
}