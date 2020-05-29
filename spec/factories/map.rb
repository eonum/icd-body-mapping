FactoryBot.define do
  factory :map do
    icd_id { Icd.first.id }
    layer_id {Layer.first.id }
    trait :second do
      icd_id { Icd.first.id }
      layer_id {Layer.second.id }
    end
  end
end