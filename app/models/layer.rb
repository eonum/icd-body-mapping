class Layer < ApplicationRecord
  validates_uniqueness_of   :ebene, scope: :img

  validates :ebene, presence: true
  validates :name, presence: true
  validates :img, presence: true

  has_many :maps
end
