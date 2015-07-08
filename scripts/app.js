/*globals $, alert*/
$(function() {
    'use strict';

    var BASE_URL = 'http://localhost:3000/todos/';
    var deleteTodo = function(id) {


        $.ajax({
            url: BASE_URL + id,
            type: 'DELETE',
            success: function() {
                //... // remove from ui
                $('li#' + id).remove();
            }
        });
    };

    var addToModel = function(todoName) {



        var newTodo = {

            title: todoName
        };


        return $.ajax({
            type: 'POST',
            url: BASE_URL,
            data: newTodo
        });
    };

    var displayCount = function(count) {
        var itemsLeft = $('<p>').text('Count: ' + count);
        $('div #count').append(itemsLeft);
    };

    var addToView = function(newTodo) {
        // new todo ui

        var strike = newTodo.completed ? 'strike' : '';
        var span = $('<span>')
            .text(newTodo.title)
            .attr('class', strike);

        var checkbox = $('<input type="checkbox">')
            .attr('value', newTodo.id)
            .attr('checked', newTodo.completed);

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

    var addEventHandler = function(id) {

        $('#' + id + ' button').click(function(event) {
            var id = parseInt(event.currentTarget.value);
            deleteTodo(id);
        });


        var checkbox = $('#' + id + ' input[type="checkbox"]');

        checkbox.click(function() {


            var completed = checkbox.is(':checked');
            $.ajax({
                url: BASE_URL + id,
                type: 'PUT',
                data: {
                    completed: completed
                },
                success: function() {

                    var span = checkbox.parent().find('span');
                    if (completed) {
                        span.addClass('strike');
                    } else {
                        span.removeClass('strike');
                    }
                }
            });

        });
    };
    //Event handlers
    $('#new-todo').keypress(function(event) {
        if (event.which === 13) {
            var todoName = event.currentTarget.value;
            if (todoName !== '') {

                var newTodo = addToModel(todoName);

                newTodo.done(function(res) {
                    addToView(res);
                });

                event.currentTarget.value = '';
            }
        }
    });


    var init = function() {
        $.getJSON(BASE_URL).done(function(data) {
            var count = data.length;
            $.each(data, function(index, elem) {
                addToView(elem);
                displayCount(count);

            });

        }).fail(function() {
            alert('Failed to connect to server');
        });

    };
    init();
});