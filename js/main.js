$(function(){
    //время начала заполнения, время отправки заявки, дельта
    var timeStart,timeEnd,timeDelta;
    //массив объектов с данными об инпутах
    var dataForm = [
        {name: 'fio',isRE: false,rE: null,isValid: false,val: null},
        {name: 'name',isRE: false,rE: null,isValid: false,val: null},
        {name: 'surname',isRE: false,rE: null,isValid: false,val: null},
        {name: 'tel',isRE: true,rE: '^[+_\\-\\(\\)\\d]+$',isValid: false,val: null},
        {name: 'email',isRE: true,rE: '^[_\\-\\.\\w]+@[_\\-\\.\\w]+\\.[\\w]{2,3}$',isValid: false,val: null},
        {name: 'passport',isRE: true,rE:'^[\\d]+[\\s][\\d]+$',isValid: false,val: null},
        {name: 'output',isRE: false,rE: null,isValid: false,val: null},
        {name: 'data_output',isRE: true,rE: '^[\\.\\d]+$',isValid: false,val: null},
        {name: 'kod1',isRE: true,rE: '^[\\d]+$',isValid: false,val: null},
        {name: 'kod2',isRE: true,rE: '^[\\d]+$',isValid: false,val: null},
        {name: 'place',isRE: false,rE: null,isValid: false,val: null}
//        {name: 'confirm',isRE: false,rE: null,isValid: false,val: true}
    ];
    //хранение массива объектов и стартового времени в локалстородже
    var ls = localStorage.getItem('dataForm');
    ls = JSON.parse(ls);
    dataForm = (ls) ? ls : dataForm;
    var ts = localStorage.getItem('timeStart');
    timeStart = (ts) ? ts : null;

    //прочие переменные
    var options = {
        borderColor: '#b2b2b2',
        nameError: 'ошибка валидации',
        en: 'qwertyuiop[]asdfghjkl;\'zxcvbnm,.QWERTYUIOP{}ASDFGHJKL:"ZXCVBNM<>',
        ru: 'йцукенгшщзхъфывапролджэячсмитьбюЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮ',
        rEForGetGender: /а$/i,
        isAllValid: function(){
            //проверка на валидность формы
            var ar = [],test = [];
            ar = dataForm.map(function(e,i){
                test.push(e);
                return e.isValid;
            });
//            console.log('ar:',ar);
            if($.inArray(false,ar) === -1 && $('#confirm').is(':checked')) {
                return true;
            }else{
                return false;
            }
        }
    };
    //модуль заполнения инпутов данными из массива
    (function getDataForm(){
        var inputs = $('form input'),
            val,isValid;
        inputs.each(function(i,e){
            el = $(e);
            var id = el.attr('id');
            $(dataForm).each(function(i,e){
                if(e.name === id){
                    val = e.val;
                    isValid = e.isValid;
                }
            });
            if(id === 'confirm' && $('#confirm').is(':checked')){
                $('#confirm').click();
            }else{
                el.val(val);
            }
            if(id === 'name' && localStorage.getItem('lsGender')){
                el.closest('.block').find('.three').html(localStorage.getItem('lsGender'));
            }
        });

    })();
    //обработка признака ошибки валидации инпута(в данном случае красный бордер)
    function setOrRemoveError(isValid,nameError,error,$this){
        if(!isValid){
//            error.html(nameError).show();
            $this.css('borderColor','red');
        }else{
//            error.html('').hide();
            $this.css('borderColor',options.borderColor);
        }
    }
    //обработка ошибок валидации всех инпутов
    function setAllErrors(){
        dataForm.forEach(function(e,i){
            var $this = $('#' + e.name);
            var error = $this.closest('.block').find('.error');
            setOrRemoveError(e.isValid,options.nameError,error,$this);
        })
    }
    //перевод слова из латиницы в кирилицу
    function lat2ruAllWord(word){//console.log(word);
        var wordNew = [],el;
        word.split('').forEach(function(e,i){
            var index = $.inArray(e,options.en);
            if( index!== -1){
                el = options.ru[index];
            }else{
                el = e;
            }
            wordNew.push(el);
        });
        return wordNew.join('');
    }
    //определение пола человека по имени
    function getGender(val){
        var gender = (val.match(options.rEForGetGender) === null) ? ('male') : ('female');
        return gender;
    }
    //обработка отправки формы по кнопке подтвердить
    $('#send').on('click',function(e){
        if(options.isAllValid()){
            console.log('valid');
            var ser = $(this).closest('form').serialize();

            timeEnd = new Date();
            timeDelta = timeEnd - timeStart;
            ser += '&time=' + timeDelta / 1000;

            $.ajax({
                url: '/action.php',
                dataType: 'json',
                type: 'POST',
                data: ser
            })
                .done(function(data){
                    localStorage.clear();
                    console.log(data);
					if(data.res === 'ok'){
                        $('#form_ok').show().delay(1000).fadeOut('slow');
                    }
                })
                .fail(function(){
                    console.log('error server');
                });
        }else{
            console.log('no_valid');
            setAllErrors();
        }
    });
    //обработчик на клик по сбросу
    $('#reset').on('click',function(e){
        localStorage.clear();
        location.reload();
    });
    //обработчик по фокусу на инпутах
    $('form').on('focus','.block input',function(e){
        timeStart = (timeStart) ? timeStart : new Date();
    });
    //обработчик по потери фокуса на текстовых инпутах
    $('form').on('blur','.block input[type="text"]',function(e){
        var $this = $(this),
            error = $this.closest('.block').find('.error'),
            three = $this.closest('.block').find('.three'),
            el = $(e.target),
            val = $.trim(el.val()),
            id = el.attr('id');

        dataForm.forEach(function(e,i){
            if(e.name === id){
                    if(e.isRE){
                        var rE = new RegExp(e.rE,'i');
                        e.isValid = !!val.match(rE);
                    }else{
                        e.isValid = !!val;
                    }
                    e.val = val;
                    setOrRemoveError(e.isValid,options.nameError,error,$this);
            }
        });
        if(id === 'name'){
            var lsGender;
            lsGender = (val) ? getGender(val) : '';
            three.html(lsGender);
            localStorage.setItem('lsGender',lsGender);
        }
    });
    //еще один обработчик на потерю фокуса в инпутах
    $('form').on('blur','.block input[type]',function(e){
        localStorage.setItem('dataForm',JSON.stringify(dataForm));
    });
    //модуль запуска перевода из латиницы спустя 500мс после остановки в поле ввода
    (function(){
        var st = null;
        $('form').on('keyup','.block input.lat2ru',function(e){
            $this = $(this);
            clearTimeout(st);
            st = setTimeout(function(){
                $this.val(lat2ruAllWord($this.val()));
            },500);
        });
    })();
    //маска валидации на избранные поля ввода
    $('#tel').mask('+7(999)999-99-99');
    $('#passport').mask('999 999');
    $('#data_output').mask('99.99.9999');
    //клик по кнопке подтвердить, если страниуа была перегружена для автоматического определения валидности
    if(ls) {$('#send').click();}
    //отладочный вывод массива
    console.log(dataForm);
});