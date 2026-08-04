from api.controllers import Tax


def test_SimpleTax():
  #Arrange
  subtotal = 15
  deliveryFee = 3.5
  #Act
  tax = Tax.calculate(subtotal, deliveryFee)
  #Assert
  assert tax == 1.53
