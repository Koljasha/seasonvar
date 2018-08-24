export default function seasonvar(url){
    let str_ = url;
    let str_Arr = str_.split('/');
    str_Arr[2] = "data-hd.datalock.ru";
    str_ = str_Arr[5];
    str_ = "hd" + str_.substring(2);
    str_Arr[5] = str_;
    str_ = str_Arr.join('/');
    window.open(str_, '_blank');
}