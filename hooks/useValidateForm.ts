import { useMemo } from 'react';

export const useValidateForm =(form:Record<string, any>)=>{
    return useMemo(()=>{
        return Object.values(form).every((value)=>{
           return typeof value === 'string' ? value.trim() !=='' : !!value;
        })
    },[form])
}
