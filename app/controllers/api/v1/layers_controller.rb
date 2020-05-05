class Api::V1::LayersController < ApplicationController

  def index
    render json: Layer.all.select('ROW_NUMBER() OVER (ORDER BY ebene) as id, ebene, count(ebene)').group('ebene').order(ebene: :asc)
  end

  def index_images
    render json: Layer.all.order(name: :asc)
  end

  def show
    layers = Layer.all.where("LOWER(ebene)=LOWER(?)", params[:id])
    render :json => layers
  end

  def new
    @layer = Layer.new
  end

  def create
    layer = Layer.create(layer_params)
    render json: layer
  end

  def update
    layer = Layer.find(params[:id])
    layer.update_attributes(layer_params)
    render json: layer
  end

  def destroy
    Layer.destroy(params[:id])
  end

  private
    def layer_params
      params.require(:layer).permit(:ebene, :name, :img)
    end
end
