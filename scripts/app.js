/*globals $*/
$(function() {
    'use strict';


    var addToModel = function(todoName) {

        // generate id
        var id = todoItems.length + 1;


        var newTodo = {
            id: id,
            name: todoName
        };
        // add to model
        todoItems.push(newTodo);

        return newTodo;
    };

    var addToView = function(newTodo) {


        // new todo ui
        var span = $('<span>').text(newTodo.name);
        var checkbox = $('<input type="checkbox">')
            .attr('value', newTodo.id);

        var button = $('<button>').text('x')
            .addClass('remove')
            .attr('id', newTodo.id)
            .attr('value', newTodo.id);

        var li = $('<li>')
            .append(checkbox)
            .append(span)
            .append(button)
            .attr('id', newTodo.id);

        $('ul').append(li);

        addEventHandler(newTodo.id);
    };

    // model
    var todoItems = [{
            id: 1,
            name: 'first job'
        }, {
            id: 2,
            name: 'second job'
        }

    ];

    var addEventHandler = function(id) {

        $('#' + id + ' button').click(function(event) {
            var id = parseInt(event.currentTarget.value);


            // remove from model
            todoItems = $.grep(todoItems,
                function(o) {
                    return o.id === id;
                },
                true);

            // remove from ui
            $('li#' + id).remove();
        });
        var checkbox = $('#' + id + ' input[type="checkbox"]');

        checkbox.click(function() {
           $(this).parent().find('span').toggleClass('strike');
        });


    };
    //Event handlers
    $('#new-todo').keypress(function(event) {
        if (event.which === 13) {
            var todoName = event.currentTarget.value;
            if (todoName !== '') {

                var newTodo = addToModel(todoName);

                addToView(newTodo);


                event.currentTarget.value = '';
            }
        }
    });


    var init = function() {
        $.each(todoItems, function(index, elem) {

            addToView(elem);
        });
    };



    init();
});