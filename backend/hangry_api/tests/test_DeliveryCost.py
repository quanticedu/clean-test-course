from types import SimpleNamespace

from api.controllers import Delivery


def make_order(*quantities):
  return [SimpleNamespace(quantity=quantity) for quantity in quantities]


def test_LotsOfItems():
  #Arrange
  order = make_order(5, 5, 5)
  delivery_distance = 6
  #Act
  cost = Delivery.calculate(order,delivery_distance)
  #Assert
  assert cost == 7.5


def test_MiddleOfTheRoadItems():
  #Arrange
  order = make_order(2, 2, 2)
  delivery_distance = 4
  #Act
  cost = Delivery.calculate(order,delivery_distance)
  #Assert
  assert cost == 5


def test_LittleItems():
  #Arrange
  order = make_order(3, 1)
  del_dist = 2
  #Act
  cost = Delivery.calculate(order, del_dist)
  #Assert
  assert cost == 3.50
