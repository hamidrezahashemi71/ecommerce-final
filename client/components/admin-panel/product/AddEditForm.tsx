import { ProductBodyForm, Category, ProductBody, ProductBodyVariables, AddEditProductForm } from "../../../lib/interfaces";
import React, {useRef} from "react";
import {useForm, useFieldArray, useWatch} from "react-hook-form";
import {Editor} from "@tinymce/tinymce-react";
import {Editor as TinyMCEEditor} from "tinymce";
import {BsCheck} from "react-icons/bs";
import {useMutation, useQuery} from "@tanstack/react-query";
import {allCategories, createProduct, upload} from "../../../apis";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import UploadModal from "../../../components/modals/Upload";
import Loading from "../../../components/main/Loading";
import ImagesBox from "../../../components/admin-panel/product/ImagesBox";
import Link from "next/link";
import CatList from "../../../components/admin-panel/product/CatList";
import VarList from "../../../components/admin-panel/product/VarList";

const AddEditProductForm = ({ useFor, defaultValues }: AddEditProductForm) => {
  
  
  const editorRef = useRef<TinyMCEEditor | null>(null);
  
  const router = useRouter()
  
  const { isLoading } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ["categories"],
    queryFn: allCategories,
    onSuccess: (data) => {
      const clone = data.map((category: Category) => {
        const vars: {}[]  = []
        Object.entries(category.variables).forEach(([key, val]) => {
          vars.push({
          name: key,
          type: val.type,
          isSelected: false,
          options: val.type === 'text' ?
            [{name: '', isSelected:false}] :
            val.options?.map(opt => ({
              name: opt,
              isSelected: false
            }))
          })
        })
        return { ...category, isSelected: false, vars }
      })
      setValue('cats', clone)
    }
  })

  const { register, control, handleSubmit, formState: { errors }, watch, getValues, setValue } = useForm<ProductBodyForm>({
    defaultValues,
    mode: "onSubmit",
  });
  
  const { fields: images, remove: removeImg, move: moveImg } = useFieldArray({ control, name: "images" });
  
  const { fields: cats } = useFieldArray({ control, name: "cats" });
  
  const thisCategory = useWatch({
    control,
    name: 'thisCategory'
  })

  const openUpload = useWatch({
    control,
    name: 'openUpload'
  })
  
  const onCategorySelect = (i: number) => {
    const clone = [...cats]
    clone.forEach((category) => category.isSelected = false )
    clone[i].isSelected = true
    setValue('cats', clone)
    setValue('thisCategory', clone[i])
  }

  const onOptionSelect = (outerIndex:number, innerIndex:number, thisType: string) => {
    const clone = { ...thisCategory }
    if (thisType === 'select')
    clone.vars[outerIndex].options.forEach(opt => opt.isSelected = false)
    clone.vars[outerIndex].options[innerIndex].isSelected = true
    clone.vars[outerIndex].isSelected = true
    setValue('thisCategory', clone)
  }
  
  const addProduct = useMutation({
    mutationFn: async (body: ProductBody) => await createProduct(body),
    onSuccess: () => {
      toast.success('Product added lool')
      router.push('/admin/dashboard/products')
    },
    onError: () => toast.error('You suck lool')
  }) 

  const onSubmit = async (data: ProductBodyForm) => {
    
    if (!thisCategory._id) return toast.error('You must select a category')
    if (!thisCategory.vars.every(item => item.isSelected)) return toast.error('Put some vars in it lool')

    const variables: ProductBodyVariables = {}
    data.thisCategory.vars.forEach(({ name, type, options }) => {
      options.forEach((opt, i, ref) => ref[i].isSelected && (  
        variables[name] ? variables[name].push(opt.name) : variables[name] = [opt.name]
        ))
      })
      
      const postFormData = (file:File) => {
        if(!file) return
        return new Promise((resolve, reject) => {
          const formData = new FormData()
          formData.append('reserve', file)
          resolve(upload(formData))
        })
      }
      
    const thisImages = []

    for (let i = 0; i < images.length; i++) thisImages.push(postFormData(getValues('files')[i]))
    
    const imageValues = await Promise.all(thisImages)

    addProduct.mutate({
      title: data.title,
      price: watch('isAvalible') ? Number(data.price) : 0,
      quantity: watch('isAvalible') ? Number(data.quantity) : 0,
      isAvalible: data.isAvalible,
      images: images[0] ? imageValues.map((item:any) => item['data'] && item?.data?.name) : ['default.svg'],
      variables,
      categoryId: data.thisCategory._id,
      description: editorRef.current?.getContent() ?? "No description provided yet."
    })
  }
  
  if (isLoading) return <Loading />;
  return (
    <div className={openUpload ? 'hidden' : ''}>
    <form onSubmit={handleSubmit(onSubmit)}>
        <div>
        {errors.title && (<p className='text-xs text-reddish ml-1'>Please enter product title</p>)}
          <input
          style={ errors.title?.ref && { border: "1px", borderStyle: "solid", borderColor: "red" } }
          placeholder='Product title...'
          className={`text-gray-600 w-full py-3 pl-2 bg-gray-100	rounded-xl outline-none mt-1 lg:mb-4 mb-8`}
          {...register('title', { required: true, maxLength: 50 })}
          />
          <Editor
            onInit={(evt, editor) => (editorRef.current = editor)}
            initialValue={getValues('description') ?? ''}
            init={{
              placeholder: "Product Description...",
              height: 500,
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount'
              ],
              toolbar: 'undo redo | formatselect | ' +
              'bold italic backcolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
            }} />
      </div>
      <div className='w-full border-[1px] border-gray-200 rounded-xl md:mr-0 mr-[1rem] mt-4 pb-6'>
        <div>
          <p className='m-4 font-semibold'>Product Details:</p>
            <div
              className='flex gap-2 items-center ml-4 cursor-pointer'
              onClick={() => setValue('isAvalible', !getValues('isAvalible'))}>
              <p className={watch('isAvalible') ? "font-semibold" : "font-normal"}>Is Available?</p>
              <div className={`w-5 h-5 rounded-md p-[1.5px]
                ${watch('isAvalible') ? "bg-gray-700" : "bg-white border-2 border-gray-200"}`}>
              {watch('isAvalible') && <BsCheck fill='white' size='18px' />}
            </div>
          </div>
          {watch('isAvalible') && (
              <div className='m-4 grid grid-cols-2 gap-3 w-1/2'>
                  <div className="col-span-1 lg:col-span-2">
                    {errors.quantity && (<p className='text-xs text-reddish ml-1'>Please enter quantity</p>)}
                    <input
                    style={ errors.quantity && { border: "1px", borderStyle: "solid", borderColor: "red" } }
                    className='w-full dashboard-input'
                    placeholder='Quantity'
                    type='number'
                    {...register('quantity', {required: getValues('isAvalible'), maxLength: 10})}/>
                  </div>
                <div className="col-span-1 lg:col-span-2">
                  {errors.price && (<p className='text-xs text-reddish ml-1'>Please enter price</p>)}
                    <input
                      style={ errors.price && { border: "1px", borderStyle: "solid", borderColor: "red" } }
                      placeholder='Price'
                      type='number'
                      className='w-full dashboard-input'
                      {...register('price', {required: getValues('isAvalible'), maxLength: 50})}/>
                </div>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-1">
          <div className="flex-1 flex-col gap-2 items-start ml-4 my-4 lg:mx-4">
            <p className="ml-1">Category</p>
              <ul className='overflow-y-auto flex flex-col w-full h-64 border-[1px] border-gray-200 rounded-xl mt-4 p-4 mr-4 md:mr-0 scrollbar-thin
            scrollbar-thumb-gray-200 scrollbar-track-gray-100'>
              {cats[0] ?
                cats.map((cat, i) => (
                  <CatList
                    key={cat._id}
                    cat={cat}
                    i={i}
                    onCategorySelect={onCategorySelect}
                  />
                )) : <p>No categories created yet.<Link href={'/admin/dashboard/categories'}> <p className="text-blueish font-semibold">Create one.</p></Link></p>
              }
          </ul> 
          </div>
          <div className="flex-1 flex-col gap-2 items-start my-4 mx-4"> 
            <p className="ml-1">Variables</p>
              <ul className="overflow-y-auto flex flex-col w-full h-64 border-[1px] border-gray-200 rounded-xl mt-4 p-4 mr-4
              md:mr-0 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-500 scrollbar-track-gray-100">
                {thisCategory._id &&
                  thisCategory.vars[0] &&
                  thisCategory.vars.map((thisVariable, outerIndex, ref) => (
                    <VarList
                      key={`var${outerIndex}`}
                      thisVariable={thisVariable}
                       outerIndex={outerIndex}
                       length={ref.length}
                      onOptionSelect={onOptionSelect}
                      register={register}
                     />
                  ))}
              </ul>
          </div>
        </div>
      </div>
      <div className='w-full grid grid-cols-3 lg:grid-cols-1 gap-4 border-[1px] border-gray-200 rounded-xl md:mr-[1rem] mr-0 mt-4 pb-6 px-4'>
          <div className="col-span-1">
            <ImagesBox
              title='Featured Image:'
              useFor="single"
              images={images}
              setValue={setValue}
              handleOpenUpload={() => setValue('openUpload', true)}
              files={getValues('files')}
              />
          </div>
          <div className="col-span-2 md::col-span-1">
          <ImagesBox
              title='Gallery:'
              useFor="multiple"
              images={images}
              setValue={setValue}
              handleOpenUpload={() => setValue('openUpload', true)}
              files={getValues('files')}
              />
          </div>
        </div>
        <button className='dashboard-btn' type='submit'>{useFor}</button>
    </form>
      {
        openUpload
        &&
        <UploadModal
          removeImg={removeImg}
          setValue={setValue}
          moveImg={moveImg}
          images={images}
          closeHandler={() => setValue('openUpload', false)}
          files={getValues('files')}
        />
        }
    </div>
  );
};

export default AddEditProductForm