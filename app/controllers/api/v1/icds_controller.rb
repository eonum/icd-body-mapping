class Api::V1::IcdsController < ApplicationController

  def index
    render json: Icd.all.order(code: :asc)
  end

  def show
    icd = Icd.find(params[:id])
    render json: icd
  end

  def create
    icd = Icd.create(icd_params)
    render json: icd
  end

  # PATCH/PUT /icds/1
  # PATCH/PUT /icds/1.json
  def update
    icd = Icd.find(params[:id])
    icd.update(icd_params)
    render json: icd
  end

  def destroy
    Icd.destroy(params[:id])
  end

  private
    def icd_params
      params.require(:icd).permit(:code, :version, :text_de, :text_fr, :text_it, :annotationen, :kapitel)
    end
end
