// opter a data do dia
exports.getDate = ()=> {
  const today = new Date();
  const options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }
   return day = today.toLocaleDateString('pt-PT', options);
}

// opter o excesso de subsidio
exports.getExSub = (subsidio)=> {
  if (subsidio > 30000){
    return subsidio - 30000;
  } else {
    return 0;
  }
}

// opter o IRT
exports.getIrt = (materiaColetavel) => {
  if (materiaColetavel <= 70000){ return 0;}
  if (materiaColetavel >= 70001 && materiaColetavel <= 100000){ return 3000 + (materiaColetavel - 70000) * (10/100);}
  if (materiaColetavel >= 100001 && materiaColetavel <= 150000){ return 6000 + (materiaColetavel - 100000) * (13/100);}
  if (materiaColetavel >= 150001 && materiaColetavel <= 200000){ return 12500 + (materiaColetavel - 150000) * (16/100);}
  if (materiaColetavel >= 200001 && materiaColetavel <= 300000){ return 31250 + (materiaColetavel - 200000) * (18/100);}
  if (materiaColetavel >= 300000 && materiaColetavel <= 500001){ return 49250 + (materiaColetavel - 300000) * (19/100);}
  if (materiaColetavel >= 500001 && materiaColetavel <= 1000000){ return 87250 + (materiaColetavel - 500000) * (20/100);}
  if (materiaColetavel >= 1000001 && materiaColetavel <= 1500000){ return 187250 + (materiaColetavel - 1000000) * (21/100);}
  if (materiaColetavel >= 1500001 && materiaColetavel <= 2000000){ return 292000 + (materiaColetavel - 1500000) * (22/100);}
  if (materiaColetavel >= 2000001 && materiaColetavel <= 2500000){ return 402250 + (materiaColetavel - 2000000) * (23/100);}
  if (materiaColetavel >= 2500001 && materiaColetavel <= 5000000){ return 517250 + (materiaColetavel - 2500000) * (24/100);}
  if (materiaColetavel >= 5000001 && materiaColetavel <= 10000000){ return 1117250 + (materiaColetavel - 5000000) * (24.5/100);}
  if (materiaColetavel >= 10000001){ return 2342250 + (materiaColetavel - 10000000) * (25/100);}
}

// calcular faltas
exports.getfalta =  (salarioBruto, falta) => {
  if (falta === ''){
    return 0;
  } else {
    return (salarioBruto / 22)*falta;
  }
}
