/*globals $, alert*/
$(function() {
    'use strict';

    var BASE_URL = 'http://localhost:3000/todos/';
    var todoItems = [];
    var count;
    var taskDone;
  // var prevCeckboxId;

    var deleteTodo = function(id) {
        $.ajax({
            url: BASE_URL + id,
            type: 'DELETE',
            success: function() {
                //... // remove from ui

                count = count - 1;
                updateCount(count);
                updateItemsleft(count,taskDone );
                var isCheckboxTicked = $('#' + id + ' input[type="checkbox"]').is(':checked');
                if (isCheckboxTicked) {
                    taskDone = taskDone - 1;
                    updateCompletedTasks(taskDone);
                }
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

    var updateCount = function(c2) {
        count = c2;
        $('div #count').html('Total Items: ' + count);
         updateItemsleft(count, taskDone);
    };
    var displayCount = function(c) {
        count = c;
        var itemsLeft = $('<p>').text('Total Items:' + count);
        $('div #count').append(itemsLeft);
    };
    var displayItemsleft = function() {
        var itemsLeft = $('<p>').text('Total Left todo:' + (count - taskDone));
        $('div #Itemsleft').append(itemsLeft);
    };
    var updateItemsleft = function(c, t) {
        $('div #Itemsleft').html('Total Left todo:' + (c - t));
    };

    var displayCompletedTasks = function(t) {
        taskDone = t;
        var competed = $('<p>').text('Completed:' + taskDone);
        $('div #completedTasks').append(competed);
    };
    var updateCompletedTasks = function(t) {
        taskDone = t;
        $('div #completedTasks').html('Completed: ' + taskDone);
        updateItemsleft(count,taskDone);
        
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
            .addClass('btn')
            .attr('id', newTodo.id)
            .attr('value', newTodo.id);

        var li = $('<li>')
            .append(checkbox)
            .append(span)
            .append(button)
            .attr('id', newTodo.id);

        var completed = checkbox.is(':checked');
        if (completed) {
            taskDone = taskDone + 1;
            updateCompletedTasks(taskDone);
        }


        $('ul').append(li);
        addEventHandler(newTodo.id);

    };

    var addEventHandler = function(id) {
        //button clicked
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
                        //
                        taskDone = taskDone + 1;
                        updateCompletedTasks(taskDone);
                      //  prevCeckboxId = id;
                    } else {
                        span.removeClass('strike');
                        // if (prevCeckboxId === id) {
                        taskDone = taskDone - 1;
                        updateCompletedTasks(taskDone);

                        // }
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
                count = count + 1;
                updateCount(count);
                
                newTodo.done(function(res) {
                    addToView(res);
                });
                event.currentTarget.value = '';
            }
        }
    });


    var init = function() {
        $.getJSON(BASE_URL).done(function(data) {
            count = data.length;
            displayCount(count);
            taskDone = 0;
            displayCompletedTasks(taskDone);
            displayItemsleft(count, taskDone);
            todoItems = data;
            $.each(data, function(index, elem) {
                addToView(elem);
            });


        }).fail(function() {
            alert('Failed to connect to server');
        });
    };
    init();
});