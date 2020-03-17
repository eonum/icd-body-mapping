class SearchController < ApplicationController


  before_action only: :search

  def index; end

  def search
    icd = Icd.ransack(code_or_text_de_cont: params[:q]).result(distinct: true).order(code: :asc)
    render json: icd
  end

  private

end