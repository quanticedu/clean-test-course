from types import SimpleNamespace

from api.controllers import Subtotal


def make_order(*items):
  return [
    SimpleNamespace(quantity=quantity, item=SimpleNamespace(price=price))
    for quantity, price in items
  ]


def test_SimpleCost():
  #Arrange
  order = make_order((5, 1.0), (5, 1.0), (5, 1.0))
  #Act
  cost = Subtotal.calculate(order)
  #Assert
  assert cost == 15


def test_ComplexCost():
  #Arrange
  order = make_order((2, 3.5), (1, 4.5))
  #Act
  cost = Subtotal.calculate(order)
  #Assert
  assert cost == 11.5
