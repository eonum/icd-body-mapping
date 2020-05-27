FactoryBot.define do
  factory :layer do
    name { "Ohr" }
    sequence(:ebene) { |n| "Ebene#{n}" }
    img { "././images/ohr" }
  end
end