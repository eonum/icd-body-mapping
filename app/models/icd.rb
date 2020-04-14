class Icd < ApplicationRecord
  validates :code, presence: true
  validates :version, presence: true
  validates :text_de, presence: true
  validates :text_fr, presence: true
  validates :text_it, presence: true

  has_many :maps
end
