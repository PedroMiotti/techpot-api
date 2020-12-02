// Format date to --> yyyy-mm-dd

function format_date(date_now){
    let date = new Date(date_now);

    let ano = date.getFullYear();
    let mes = date.getMonth() + 1;
    let dia = date.getDate();
    
    let date_formated;

    if (dia < 10) {
        dia = '0' + dia;
    }

    if (mes < 10) {
        mes = '0' + mes;
    }

    date_formated = ano + '-' + mes + '-' + dia ;

    return date_formated
}

module.exports = format_date;