class SearchController < ApplicationController


  before_action only: :search

  def index; end

  def search
    icd = Icd.ransack(code_or_text_de_cont: params[:q]).result(distinct: true)
    render json: icd
  end

  private

  def set_icd
    @icd = Icd.find(params[:id])
  end
end