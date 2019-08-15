import request from '@/plugin/axios'
export const getToken=()=>{
    return request({
        url:'/wx/cgi-bin/token?grant_type=client_credential&appid=wx77b72750d6dd14e5&secret=f3139fb838c3bb76ed05758b5e2e294e'
    })
}
export const getUserFromWx=(data)=>{
    return request({
        url:`/wx/tcb/invokecloudfunction?access_token=${data}&env=fayuandi-v1&name=userFromWX`,
        method:'POST',
        data:{}
    })
}
export const updateUserFromWx=(data)=>{
    return request({
        url:`/wx/tcb/invokecloudfunction?access_token=${data.token}&env=fayuandi-v1&name=updateUserFromWx`,
        method:'POST',
        data:{
            _id:data._id
        }
    })
}
export const deleteUserFromWx=(data)=>{
    return request({
        url:`/wx/tcb/invokecloudfunction?access_token=${data.token}&env=fayuandi-v1&name=deleteUserFromWx`,
        method:'POST',
        data:{
            _id:data._id
        }
    })
}