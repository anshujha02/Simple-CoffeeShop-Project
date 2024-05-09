$(document).ready(function() {
    
    var $orders = $('#orders');
    var $name = $('#name');
    var $drink = $('#drink');
    var $snack = $('#snack');
    var $special = $('#special');
    
    var orderTemplate = $('#order-template').html();
    
    function addOrder(order){
        $orders.append(Mustache.render(orderTemplate, order));
    }
    
    
    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/orders/',
        success: function(orders){
            $.each(orders, function(i, order){
               addOrder(order);
            });
        },
        error: function(){
            alert('Error loading orders');
        }
    });
    
    $('#add-order').on('click', function(){
        
        var order = {
            name: $name.val(),
            drink: $drink.val(),
            snack: $snack.val(),
            special: $special.val()
        };
        
        var data = JSON.stringify(order);
        $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/orders/',
            data: data,
            success: function(newOrder){
                addOrder(newOrder);
            },
            error: function(){
                alert('Error saving orders');
            }
        });
    });
    
    $orders.delegate('.remove','click', function(){
        
        var $li = $(this).closest('li');
        
        var self = this;
        
        $.ajax({
            type: 'DELETE',
            url: 'http://localhost:3000/orders/' + $(this).attr('data-id'),
            success: function(){
               $(self);
               $li.fadeOut(300, function(){
                   $(this).remove();
               });
            }
        });
        
    });

    $orders.delegate('.editOrder', 'click', function(){
        var $li = $(this).closest('li');

        $li.find('input.name').val($li.find('span.name').html());
        $li.find('input.drink').val($li.find('span.drink').html());
        $li.find('input.snack').val($li.find('span.snack').html());
        $li.find('input.special').val($li.find('span.special').html());

        $li.addClass('edit');
    });

    $orders.delegate('.cancelEdit', 'click', function(){
        $(this).closest('li').removeClass('edit');
    });
    
    $orders.delegate('.saveEdit', 'click', function(){
       var $li = $(this).closest('li');

        var order = {
            name: $li.find('input.name').val(),
            drink: $li.find('input.drink').val(),
            snack: $li.find('input.snack').val(),
            special: $li.find('input.special').val()
        };
        var data = JSON.stringify(order);
        $.ajax({
            type: 'PUT',
            url: 'http://localhost:3000/orders/' + $li.attr('data-id'),
            data: data,
            success: function(newOrder){
                $li.find('span.name').html(order.name);
                $li.find('span.drink').html(order.drink);
                $li.find('span.snack').html(order.snack);
                $li.find('span.special').html(order.special);
                $li.removeClass('edit');
            },
            error: function(){
                alert('Error updating orders');
            }
        });
    });
});